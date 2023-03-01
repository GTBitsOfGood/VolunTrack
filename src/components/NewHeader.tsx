import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NewHeader: React.FC = () => {
  const router = useRouter();
  const {
    data: { user },
  }: { data: any } = useSession(); // refactor to use UserType instead of any

  return (
    <nav className="flex bg-black px-12 py-12">
      <Link href="/home">
        <div className="flex cursor-pointer items-center justify-center">
          <Image
            src="/images/helping_mamas_logo.png"
            height="60px"
            width="300px"
            alt="logo"
          />
        </div>
      </Link>
    </nav>
  );
};

export default NewHeader;
