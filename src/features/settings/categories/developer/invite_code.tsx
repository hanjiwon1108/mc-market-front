import { SettingsPage } from '@/features/settings/components/page';
import { SettingsSection } from '@/features/settings/components';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';

export function DeveloperInviteCodeSettings() {
  return (
    <SettingsPage>
      <SettingsSection name="Issue new invite code">
        <ResponsiveDialog>
          <ResponsiveDialogTrigger asChild>
            <Button variant="secondary" className="w-full">
              Issue new invite code
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Issue new invite code
              </ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="flex flex-col gap-4 p-4 md:gap-2 md:p-2">
              <Input placeholder="Code" />
              <Input placeholder="Name" />
            </div>
            <ResponsiveDialogFooter>
              <Button>Issue</Button>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </SettingsSection>
    </SettingsPage>
  );
}
