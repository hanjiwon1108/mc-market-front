import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useEffect, useRef, useState } from 'react';
import {
  ANONYMOUS,
  loadTossPayments,
  TossPaymentsWidgets,
  WidgetAgreementWidget,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { v4 } from 'uuid';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useSession } from '@/api/surge';

export function ChargeCashDialog({
  isOpen,
  onOpenChange,
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

  const [amount, setAmount] = useState(toCharge ?? 0);

  useEffect(() => {
    if (!renderWidget || !isOpen) {
      paymentMethodsWidget?.current?.destroy();
      agreementWidget?.current?.destroy();
      return;
    }

    (async () => {
      const tossPayments = await loadTossPayments(
        'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      );
      widgets.current = tossPayments.widgets({
        customerKey: ANONYMOUS,
      });

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
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {toCharge || renderWidget ? `${amount}원 충전하기` : `충전하기`}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div id="tosspayments-method" />
        <div id="tosspayments-agreement" />

        <Label>충전할 금액 (KRW)</Label>
        <Input
          type="number"
          placeholder="충전"
          value={amount}
          onValueChange={(v) => setAmount(parseInt(v))}
          disabled={!!(toCharge || renderWidget)}
        />
        {!renderWidget && (
          <Button disabled={amount == 0} onClick={() => setRenderWidget(true)}>
            진행
          </Button>
        )}

        {renderWidget && (
          <div className="flex gap-2 *:flex-1">
            {!toCharge && (
              <Button variant="outline" onClick={() => setRenderWidget(false)}>
                충전액 변경
              </Button>
            )}
            <Button onClick={proceed}>결제</Button>
          </div>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
