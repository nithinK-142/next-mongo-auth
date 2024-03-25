import Logout from "@/components/Logout";

export default async function Home() {
  return (
    <main className="flex flex-col items-center text-center">
      <h1 className="text-center text-2xl p-24">NextJs Mongo Auth</h1>
      <Logout />
    </main>
  );
}
