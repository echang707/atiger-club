"use client";

/* The profile now lives on /member. Old links land on its profile section. */

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileClient() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/member#profile");
  }, [router]);
  return <main className="min-h-svh" />;
}
