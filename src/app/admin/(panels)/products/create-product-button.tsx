import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import useSWRMutation from "swr/mutation";
import {endpoint} from "@/api/market/endpoint";
import {useSession, useUser} from "@/api/surge";
import {authFetch} from "@/api/surge/fetch";
import {toast} from "sonner";

export function CreateProductButton() {
    const session = useSession();
    const user = useUser();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [usage, setUsage] = useState("");
    const [uploader, setUploader] = useState(`${user?.id}` ?? '');

    const [isMutating, setMutating] = useState(false)

    function trigger() {
        if(!session) return;
        setMutating(true)
        authFetch(session, endpoint(`/v1/products`), {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({name, description, category, usage, creator: Number(BigInt(uploader))})
        }).then(it => {
            setMutating(false)
            toast.info("제품 등록됨")
        });
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">새 제품 등록</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>새 제품 등록</DialogTitle>
            </DialogHeader>

            <Label htmlFor="create_product/id">제품 이름</Label>
            <Input id="create_product/id" value={name} onValueChange={setName} />
            <Label htmlFor="create_product/uploader">제품 업로더 (유저 ID)</Label>
            <Input id="create_product/uploader" value={uploader} onValueChange={setUploader} />
            <Label htmlFor="create_product/description">제품 설명</Label>
            <Input id="create_product/description" value={description} onValueChange={setDescription} />
            <Label htmlFor="create_product/usage">제품 사용법</Label>
            <Input id="create_product/usage" value={usage} onValueChange={setUsage} />
            <Label htmlFor="create_product/category">제품 카테고리 (카테고리 식별자)</Label>
            <Input id="create_product/category" value={category} onValueChange={setCategory} />
            <Button onClick={trigger} disabled={isMutating}>생성</Button>
        </DialogContent>
    </Dialog>
}