'use client'

import {Input} from "@/components/ui/input";
import React from "react";
import {ProductCard} from "@/components/product/product-card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function ProductSearch() {
    return <div className="container mx-auto lg:px-[5.75rem] mt-8 ">
        <div className="flex items-center gap-4 p-6">
            <p className="text-3xl font-semibold w-20">검색</p>
            <Input placeholder="키워드 입력"/>
        </div>
        <div className="flex-col flex md:flex-row mt-12 p-2 gap-4">
            <div className="w-full md:w-1/5">
                <div className="w-full bg-accent h-96 flex flex-col gap-2 rounded-lg p-4">
                    <p className="text-2xl font-semibold ">
                        필터
                    </p>
                    <Select modal={false}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="정렬" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">최신 순</SelectItem>
                            <SelectItem value="stars">구매 순</SelectItem>
                            <SelectItem value="prices">가격 순</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-full md:w-4/5 grid grid-cols-4 grid-rows-auto mb-20">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
        </div>
    </div>
}