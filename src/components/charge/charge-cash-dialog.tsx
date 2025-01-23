import { useEffect, useRef, useState } from 'react';
import {
  ANONYMOUS,
  loadTossPayments,
  TossPaymentsWidgets,
  WidgetAgreementWidget,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { Button } from '@/components/ui/button';
import { v4 } from 'uuid';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useSession } from '@/api/surge';
import CashButton from './cashbutton';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreditCardIcon } from 'lucide-react';

export function ChargeCashDialog({
  isOpen,
  toCharge,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  toCharge?: number;
}) {
  const session = useSession();

  const widgets = useRef<TossPaymentsWidgets>();
  const paymentMethodsWidget = useRef<WidgetPaymentMethodWidget>();
  const agreementWidget = useRef<WidgetAgreementWidget>();
  const [renderWidget, setRenderWidget] = useState(false);

  const constantCash = [1000, 5000, 10000, 30000, 50000, 100000];
  const isMobile = useIsMobile();

  const [amount, setAmount] = useState(toCharge ?? 0);

  useEffect(() => {
    if (!renderWidget || !isOpen) {
      paymentMethodsWidget?.current?.destroy();
      agreementWidget?.current?.destroy();
      return;
    }

    (async () => {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY as string,
      );
      widgets.current = tossPayments.widgets({
        customerKey: ANONYMOUS,
      });
      document.body.style.pointerEvents = '';

      await widgets.current.setAmount({ currency: 'KRW', value: amount });

      paymentMethodsWidget.current = await widgets.current.renderPaymentMethods(
        {
          selector: '#tosspayments-method',
        },
      );
      agreementWidget.current = await widgets.current.renderAgreement({
        selector: '#tosspayments-agreement',
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderWidget, isOpen]);

  async function proceed() {
    const orderId = v4();

    const createPaymentResponse = await authFetch(
      session,
      endpoint('/v1/payments'),
      {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId, amount: amount }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!createPaymentResponse.ok) {
      toast.error('결제 등록 실패');
      return;
    }

    widgets.current?.requestPayment({
      orderId: orderId,
      orderName: 'MC-Market 충전',
      successUrl: window.location.origin + '/charge/approve',
      failUrl: window.location.origin + '/charge/failed',
    });
  }

  return (
    <div className="m-auto max-w-screen-xl pt-10">
      <div className="text-center text-3xl font-bold">
        {toCharge || renderWidget
          ? `${amount.toLocaleString()}원 충전하기`
          : `충전할 금액을 입력해주세요.`}
      </div>

      <div id="tosspayments-method" />
      <div id="tosspayments-agreement" />

      <div
        className={`mt-4 flex justify-center gap-4 py-4 ${isMobile ? 'flex-col items-center' : 'flex-row items-start'}`}
      >
        {!renderWidget && (
          <div className="flex flex-col items-center p-4">
            <CreditCardIcon size={isMobile ? 150 : 300} />
          </div>
        )}
        <div className="flex max-w-3xl flex-col items-center gap-4">
          {!renderWidget && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {constantCash.map((cash) => (
                <CashButton
                  key={cash}
                  selected={cash == amount}
                  CashAmount={cash}
                  onClick={() => setAmount(cash)}
                  disabled={!!(toCharge || renderWidget)}
                />
              ))}
            </div>
          )}
          {!renderWidget && (
            <div className="mt-5 flex w-80 gap-2 *:flex-1">
              <Button
                disabled={amount == 0}
                onClick={() => setRenderWidget(true)}
                className="w-40"
              >
                진행
              </Button>
            </div>
          )}
          {renderWidget && (
            <div className="flex gap-2 *:flex-1">
              {!toCharge && (
                <Button
                  variant="outline"
                  onClick={() => setRenderWidget(false)}
                >
                  충전액 변경
                </Button>
              )}
              <Button onClick={proceed}>결제</Button>
            </div>
          )}
          {!renderWidget && (
            <details className="p-4" open>
              <summary>결제 약관</summary>
              <p>• 충전 캐시는 최대 200만원까지 보유할 수 있습니다.</p>
              <p>• 충전 금액은 1회 최대 10만원으로 제한됩니다.</p>
              <p>
                • 충전된 포인트의 이용기간과 환불가능기간은 결제시점으로부터 1년
                이내로 제한됩니다.
              </p>
              <p>• 보너스 캐시는 충전 캐시가 아님으로, 환불이 불가능합니다.</p>
              <p>
                • 충전 캐시는 상품/서비스 구매를 위하여 사전에 일정 금액을
                예치하는 것이므로 세금계산서 발행 대상이 아닙니다.
              </p>
              <p>
                • 충전 캐시를 사용하여 상품/서비스를 구매하실 때 결제 금액에
                대한 세금계산서 신청이 가능합니다. (개인전문가는 발행 불가).
              </p>
              <p>
                • 충전 캐시의 영수증(신용카드 전표/현금영수증)은 개인
                소득공제용으로만 사용하실 수 있습니다.
              </p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
