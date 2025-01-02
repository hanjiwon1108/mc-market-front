'use client';

import { SettingsPage } from '@/features/settings/components/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, Loader2, UserIcon } from 'lucide-react';
import { SettingsSection } from '@/features/settings/components';
import { toast } from 'sonner';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { useSession } from '@/api/surge';
import { useMapleUser } from '@/api/market/context';

function AvatarUpload() {
  const user = useMapleUser();
  const session = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatar(endpoint(`/v1/user/${user?.id}/avatar`));
    }
  }, [file, user?.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading('저장하는 중');
    const data = new FormData();
    data.append('file', file);
    const response = await authFetch(session, endpoint('/v1/user/avatar'), {
      method: 'POST',
      body: data,
    });
    if (response.ok) {
      toast.info('아바타 변경을 완료했습니다', { id: toastId });
    } else {
      toast.error('아바타 변경 실패', { id: toastId });
    }
    setIsUploading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={avatar ?? undefined} alt="Avatar" />
          <AvatarFallback>
            <UserIcon className="size-1/2" />
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col items-center space-y-2">
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>변경</span>
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="flex w-full gap-2 *:flex-1">
            {file && (
              <Button variant="outline" onClick={() => setFile(null)}>
                취소
              </Button>
            )}
            <Button onClick={handleUpload} disabled={!avatar || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserProfileSettings() {
  return (
    <SettingsPage>
      <SettingsSection name="프로필">
        <AvatarUpload />
      </SettingsSection>
    </SettingsPage>
  );
}
