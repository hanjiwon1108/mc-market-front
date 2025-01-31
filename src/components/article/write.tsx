'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { BasicEditor } from '@/components/editor/basic-editor';
import { ErrorScreen } from '@/components/error/error-screen';
import {
  getMapleUserPermission,
  MAPLE_USER_PERMISSION_ADMINISTRATOR,
} from '@/api/permissions';

type HeadType = {
  id: string;
  is_admin: boolean;
  name: string;
};

type WriteProps = {
  title: string;
  content: string;
  head: string;
  upload: (title: string, content: string, head: string) => Promise<void>;
  uploading: boolean;
};

export default function WriteComponent({
  upload,
  uploading,
  content,
  head,
  title,
}: WriteProps) {
  const session = useSession();
  const [newtitle, setTitle] = useState(title);
  const [newcontent, setContent] = useState(content);
  const [newhead, setHead] = useState(head);
  const [headList, setHeadList] = useState<HeadType[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  async function getHeadList() {
    const response = await fetch(endpoint('/v1/article_head/list/'));
    if (!response.ok) {
      toast.error('헤드 목록을 가져오는데 실패했습니다');
      return;
    }

    const data = await response.json();
    setHeadList(data);
    const nHead =
      data.filter((head: HeadType) => head.name === newhead)[0]?.id || '';
    setHead(nHead);
  }

  useEffect(() => {
    getHeadList();
    checkPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkPermission() {
    const permission = await getMapleUserPermission(
      MAPLE_USER_PERMISSION_ADMINISTRATOR,
    );
    setIsAdmin(permission);
  }

  if (!session) {
    return <ErrorScreen>인증 필요</ErrorScreen>;
  }

  return (
    <div className="scrollbar-override flex h-full w-full flex-col gap-2">
      <div className="text-4xl font-semibold">글 작성</div>
      <div className="flex gap-2">
        {headList?.length > 0 && (
          <select
            className="py-y cursor-pointer rounded-lg border border-gray-300 px-4"
            value={newhead}
            defaultValue={newhead || ''}
            onChange={(e) => setHead(e.target.value)}
          >
            <option value="">말머리 선택</option>
            {headList.map(
              (head) =>
                (head.is_admin ? isAdmin : true) && (
                  <option
                    key={head.id}
                    value={head.id}
                    selected={head.id === newhead}
                  >
                    {head.name}
                  </option>
                ),
            )}
          </select>
        )}
        <Input placeholder="제목" value={newtitle} onValueChange={setTitle} />
      </div>
      <div className="overflow-y-auto">
        <BasicEditor content={newcontent} onContentChange={setContent} />
      </div>
      <Button
        onClick={() => upload(newtitle, newcontent, newhead.toString())}
        disabled={uploading}
        className="ml-auto w-32 px-6 py-6 text-lg"
      >
        {uploading ? '업로드 중' : '업로드'}
      </Button>
    </div>
  );
}
