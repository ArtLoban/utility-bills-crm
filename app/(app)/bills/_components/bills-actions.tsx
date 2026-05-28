"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export const BillsActions = () => (
  <Button asChild>
    <Link href="/bills/new">
      <Plus size={14} />
      Add Bill
    </Link>
  </Button>
);
