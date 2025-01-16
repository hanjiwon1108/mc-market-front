import { ChildrenProps } from '@/util/types-props';

export type SettingsSectionProps = {
  name: string;
} & ChildrenProps;

export function SettingsSection({ name, children }: SettingsSectionProps) {
  return (
    <div>
      <div className="flex items-center border-b text-xl md:text-2xl pb-1 mb-2">
        <span className="mr-2 text-gray-400">#</span>
        {name}
      </div>
      <div>{children}</div>
    </div>
  );
}
