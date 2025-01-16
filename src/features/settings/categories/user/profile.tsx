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
import { useSession, useUser } from '@/api/surge';
import { useMaple, useMapleUser } from '@/api/market/context';
import { Label } from '@/components/ui/label';
import useSWRMutation from 'swr/mutation';
import { MarketUser } from '@/api/types';

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

export function Username() {
  const user = useUser();
  const [value, setValue] = useState<string>(user?.username ?? '');
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="username">아이디</Label>
      <Input
        id="username"
        className="w-min"
        placeholder="아이디"
        value={value}
        onValueChange={setValue}
        disabled={true}
      />
      {/*<Button disabled={value == user?.username}>저장</Button>*/}
    </div>
  );
}

export function Nickname() {
  const session = useSession();
  const { user, updateUser } = useMaple();
  const [value, setValue] = useState<string>(user?.nickname ?? '');
  const mutation = useSWRMutation(
    [endpoint(`/v1/user/${user?.id}`), session, value],
    ([u, s]) =>
      authFetch(s, u, {
        method: 'POST',
        body: JSON.stringify({ nickname: value }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((r) => {
        void updateUser({ ...(user as MarketUser), nickname: value });
        return r.ok;
      }),
  );

  return (
    <div className="mt-2 flex items-center gap-2">
      <Label htmlFor="nickname" className="">
        닉네임
      </Label>
      <Input
        id="nickname"
        className="w-min"
        placeholder="닉네임"
        value={value}
        onValueChange={setValue}
      />
      <Button
        disabled={value == user?.nickname}
        onClick={() => mutation.trigger()}
      >
        저장
      </Button>
    </div>
  );
}

export function UserProfileSettings() {
  return (
    <SettingsPage>
      <SettingsSection name="아바타">
        <AvatarUpload />
      </SettingsSection>
      <SettingsSection name="이름">
        <Username />
        <Nickname />
      </SettingsSection>
    </SettingsPage>
  );
}
