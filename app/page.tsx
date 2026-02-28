import Content from "@/app/_components/landing/Content";
import { getCharges } from "@/app/charge/_actions";
import { ChargeType } from "@/types/charge";

export default async function Home() {
  const res = await getCharges();
  console.log("res: ", res);
  let charges: ChargeType[] = [];

  if (res.success) {
    charges = Array.isArray(res.data) ? res.data : [];
  }

  return (
    <>
      <Content
        charges={charges}
        status={{
          charges: {
            isError: !res.success,
            message: res.message,
          },
        }}
      />
    </>
  );
}
