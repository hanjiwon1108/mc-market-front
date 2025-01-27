'use client';
import { useSession } from '@/api/surge';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { toast } from 'sonner';

export default function EditButton({
  authorId,
  articleId,
}: {
  authorId: string;
  articleId: string;
}) {
  const session = useSession();
  const router = useRouter();

  const deleteArticle = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const response = await authFetch(
      session,
      endpoint(`/v1/articles/${articleId}`),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      toast.error('삭제 실패');
    } else {
      router.push('/articles/');
    }
  };
  return (
    <>
      {authorId === session?.user.id?.toString() && (
        <div className="flex gap-1">
          <Button
            className="p-4"
            onClick={() => router.push(`/articles/${articleId}/edit`)}
          >
            수정
          </Button>
          <Button className="p-4" onClick={deleteArticle}>
            삭제
          </Button>
        </div>
      )}
    </>
  );
}
