"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { sidebarNavigation } from "@/config/sidebar-nav";

// Fungsi untuk mencari label berdasarkan path dari sidebarNavigation
function findLabelsByPath(pathname: string): { href: string; label: string }[] {
  const labels: { href: string; label: string }[] = [];

  for (const item of sidebarNavigation) {
    // Jika ada submenu
    if (item.subMenu) {
      for (const sub of item.subMenu) {
        if (pathname.startsWith(sub.href)) {
          labels.push({
            href: item.subMenu[0].href.split("/")[1],
            label: item.label,
          }); // parent
          labels.push({ href: sub.href, label: sub.label }); // child
          return labels;
        }
      }
    }

    // Jika langsung punya href (tanpa submenu)
    if (item.href && pathname.startsWith(item.href)) {
      labels.push({ href: item.href, label: item.label });
      return labels;
    }
  }

  return labels;
}

export function BreadcrumbComponent() {
  const pathname = usePathname();
  const labels = findLabelsByPath(pathname);

  // Jika tidak ditemukan di config, fallback ke path biasa
  const pathSegments =
    labels.length === 0 ? pathname.split("/").filter(Boolean) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {(labels.length > 0 || pathSegments.length > 0) && (
          <BreadcrumbSeparator />
        )}

        {/* Jika ditemukan di sidebarNavigation */}
        {labels.length > 0
          ? labels.map((item, index) => {
              const isLast = index === labels.length - 1;
              return (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })
          : // Jika tidak ada match di sidebarNavigation, tampilkan versi path default
            pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;
              const label = decodeURIComponent(segment)
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <React.Fragment key={href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
