import { SettingsPage } from '@/features/settings/components/page';
import { ThemeButton } from '@/components/control/theme-button';
import { SettingsSection } from '@/features/settings/components';

export function GeneralAppearanceSettings() {
  return (
    <SettingsPage>
      <SettingsSection name="Theme">
        <ThemeButton className="w-full" variant="secondary"/>
      </SettingsSection>
    </SettingsPage>
  );
}
