import Checkout from "@/components/Payment/Checkout";
import GcashCard from "@/components/Payment/GcashCard";
import OnlineCard from "@/components/Payment/OnlineCard";

export default function Home() {
  return (
    <div className="flex p-20 w-screen gap-20 items-center justify-center h-screen">
      <GcashCard />
      <OnlineCard />
      <Checkout />
    </div>
  );
}