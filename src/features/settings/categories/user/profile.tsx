import { SettingsPage } from '@/features/settings/components/page';
import { ThemeButton } from '@/components/control/theme-button';
import { SettingsSection } from '@/features/settings/components';

export function UserProfileSettings() {
  return (
    <SettingsPage>
      <div>
        <p className="text-2xl font-semibold">오류</p>
        호환되지 않는 API 버전입니다.
        <br />
        서버 관리자에게 문의하십시오.
        <br />
        <br />
        <p className="font-semibold underline">Requires 153</p>
      </div>
    </SettingsPage>
  );
}
