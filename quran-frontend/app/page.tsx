import Image from "next/image";
import TopBar from "../Components/Home/TopBar";
import { redirect } from "next/navigation";

export default function Home() {

  redirect('/surah/1');

  return (
    <div>
      <TopBar />
    </div>
  );
}
