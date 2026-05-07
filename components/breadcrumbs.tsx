import { Fragment } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type TBreadcrumb = {
  label: string;
  href?: string;
};

type TProps = {
  items: TBreadcrumb[];
};

export const Breadcrumbs = ({ items }: TProps) => (
  <Breadcrumb className="mb-4">
    <BreadcrumbList>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            {item.href ? (
              <BreadcrumbLink render={<Link href={item.href} />}>{item.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);
