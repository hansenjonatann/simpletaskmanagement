'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function DashboardPage() {
  const {data} = useSession()
  const {data: categories = []} = api.category.get.useQuery({userId: String(data?.user?.id )});
  const {data: tasks = []} = api.task.get.useQuery({userId: String(data?.user?.id )});
  const {data: taskdoned = []} = api.task.filterByStatus.useQuery({userId: String(data?.user?.id) , status: 'DONE'})
  const {data: taskdoing = []} = api.task.filterByStatus.useQuery({userId: String(data?.user?.id) , status: 'DOING'})
  const {data: tasktodo = []} = api.task.filterByStatus.useQuery({userId: String(data?.user?.id) , status: 'TODO'})
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard / Main</h1>
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
            <Link
              href="/dashboard/category"
              className="my-4 flex h-24 max-w-[300px] items-center justify-center transition-all duration-500 ease-in-out hover:bg-orange-400 rounded-md bg-orange-600 p-2 text-white"
            >
              <div className="flex flex-col">
                <p className="text-xl font-bold text-center">{categories.length}</p>
                <h1> Category</h1>
              </div>
            </Link>{" "}
            <Link href={'/dashboard/task'} className="my-4 flex h-24 transition-all duration-500 ease-in-out hover:bg-teal-500 max-w-[300px] items-center justify-center rounded-md bg-teal-600 p-2 text-white">
              <div className="flex flex-col">
                <p className="text-xl font-bold text-center">{tasks.length}</p>
                <h1>Task</h1>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="my-4 flex h-24 max-w-[300px] items-center justify-center rounded-md bg-green-600 p-2 text-white">
              <div className="flex items-center space-x-2 ">
                <p className="font-bold text-xl">{taskdoned.length}</p>
                <h1>DONE</h1>
              </div>
            </div>
            <div className="my-4 flex h-24 max-w-[300px] items-center justify-center rounded-md bg-red-600 p-2 text-white">
            <div className="flex items-center space-x-2 ">
                <p className="font-bold text-xl">{taskdoing.length}</p>
                <h1>DOING</h1>
              </div>
            </div>
            <div className="my-4 flex h-24 max-w-[300px] items-center justify-center rounded-md bg-sky-600 p-2 text-white">
            <div className="flex items-center space-x-2 ">
                <p className="font-bold text-xl">{tasktodo.length}</p>
                <h1>TODO</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
