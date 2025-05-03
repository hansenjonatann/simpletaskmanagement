"use client";
import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "~/app/_components/button";
import { api } from "~/trpc/react";
import {  FilterX, Loader2, Trash, X } from "lucide-react";
import FormField from "~/app/_components/form-field";

export default function DashboardTaskPage() {
  const { data } = useSession();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [due, setDue] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [filteredStatus , setFilteredStatus] = useState<string>('')
  const [filteredCategory , setFilteredCategory] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  

  const [isModal, setIsModal] = useState<boolean>(false);

  const closeModal = async () => {
    setIsModal(false);
    await refetch();
  };

  const { data: categories = [] } = api.category.get.useQuery({
    userId: String(data?.user?.id),
    
  });

  const { data: tasks = [], refetch } = api.task.get.useQuery({
    userId: String(data?.user?.id),
  });

  
  const {data: filteredtaskbystatus = []} = api.task.filterByStatus.useQuery({status: filteredStatus , userId: data?.user?.id as string} , {enabled: !!filteredStatus})

  const {data: filteredtaskbycategory = []} = api.task.filterByCategory.useQuery({userId: data?.user?.id as string , categoryId: filteredCategory} , {enabled: !!filteredCategory})

  const changeStatusMutation = api.task.changeStatus.useMutation({
    onSuccess: () => {
      
      toast.success('Sucess update status of todo')

    }

  })


  
  

  

  const handleChangeStatus =  (id: string , status: 'TODO' | 'DOING' | 'DONE') => {
     changeStatusMutation.mutateAsync({id , status , userId: String(data?.user?.id)})
     refetch()
  }

  const handleClearFilter = () => {
    setFilteredCategory('')
    setFilteredStatus('')
  }
  const taskMutation = api.task.create.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast.success("Adding task success!");
      closeModal();
    },
    onError: (e) => {
      setLoading(false);
      toast.error(e.message);
    },
  });


  const deleteMutation = api.task.delete.useMutation({
    onSuccess: async () => {
      setLoading(false);
      toast.success("Delete task success!");
      await refetch();
    },

    onError: (e) => {
      setLoading(false);
      toast.error(e.message);
    },
  });

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    deleteMutation.mutate({ id: id, userId: String(data?.user?.id) });
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    taskMutation.mutate({
      title: title,
      content: content,
      due: due,
      categoryId: categoryId,
      userId: String(data?.user?.id),
    });
  };
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard / Task</h1>
       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
       <Button
          label="Add Task"
          type="button"
          onclick={() => setIsModal(true)}
          isloading={false}
          color="info"
        />
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <select
  className="bg-gray-900 px-2 rounded-md text-white"
  onChange={(e) => setFilteredStatus(e.target.value as 'TODO' | 'DOING' | 'DONE' )}
>
  <option value="">Select Status</option>
  <option value="TODO">TODO</option>
  <option value="DOING">DOING</option>
  <option value="DONE">DONE</option>
</select>

<select
  className="bg-gray-900 px-2 rounded-md text-white"
  onChange={(e) => setFilteredCategory(e.target.value )}
>
  <option value="">Select Category</option>
  {categories.map((cat: any , idx: number) => (
    <option key={idx} value={cat.id}>{cat.name}</option>
  ))}
</select>
<button onClick={handleClearFilter} className="bg-gray-900 text-white w-[100px] text-center  rounded-lg ">
  <div className="flex justify-center">
  <FilterX/>
  </div>
</button>
       </div>

       </div>
      <div className="mt-8">
        <table className="w-full table-auto border-t-0 border-r border-b-0 border-l border-t-gray-600 border-r-gray-500 border-l-gray-500">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border-b-2 border-b-black py-2">#</th>
              <th className="border-b-2 border-b-black py-2">Title</th>
              <th className="border-b-2 border-b-black py-2">Category</th>
              <th className="border-b-2 border-b-black py-2">Due</th>
              <th className="border-b-2 border-b-black py-2">Status</th>
              <th className="border-b-2 border-b-black py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white shadow-sm">
            { filteredCategory ? filteredtaskbycategory.map((task: any  , idx: number) => (
              <tr key={idx}>
              <td className="p-2 text-center">{idx + 1}</td>
              <td className="p-2 text-center">{task.title}</td>
              <td className="p-2 text-center">{task.category.name}</td>
              <td className="p-2 text-center">{task.due}</td>
              <td className="p-2 text-center">
               <p className={`${task.status == 'TODO' ? 'text-blue-600 font-bold' : task.status == 'DOING' ? 'text-orange-800 font-bold' : task.status == 'DONE' ? 'text-green-800 font-bold' : null }`}>{task.status}</p>
              </td>
              <td className="p-2 text-center">
                <div className="flex gap-x-3">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-lg bg-red-600 p-2 text-white"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash />
                    )}
                  </button>
                  <select
                  value={task.status}
                  onChange={(e) => handleChangeStatus(task.id, e.target.value as 'TODO' | 'DOING' | 'DONE')}
                  className={`rounded-md border w-full px-2 py-1 text-sm ${
                    task.status === "DONE"
                      ? "bg-green-100 text-green-800"
                      : task.status === "DOING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <option value="TODO">TODO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </select>
                </div>
              </td>
            </tr>
            )) : filteredStatus ? filteredtaskbystatus?.map((task: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2 text-center">{task.title}</td>
                <td className="p-2 text-center">{task.category.name}</td>
                <td className="p-2 text-center">{task.due}</td>
                <td className="p-2 text-center">
                 <p className={`${task.status == 'TODO' ? 'text-blue-600 font-bold' : task.status == 'DOING' ? 'text-orange-800 font-bold' : task.status == 'DONE' ? 'text-green-800 font-bold' : null }`}>{task.status}</p>
                </td>
                <td className="p-2 text-center">
                  <div className="flex gap-x-3">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-lg bg-red-600 p-2 text-white"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash />
                      )}
                    </button>
                    <select
                    value={task.status}
                    onChange={(e) => handleChangeStatus(task.id, e.target.value as 'TODO' | 'DOING' | 'DONE')}
                    className={`rounded-md border w-full px-2 py-1 text-sm ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-800"
                        : task.status === "DOING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <option value="TODO">TODO</option>
                    <option value="DOING">DOING</option>
                    <option value="DONE">DONE</option>
                  </select>
                  </div>
                </td>
              </tr> )) : tasks.map((task: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2 text-center">{task.title}</td>
                <td className="p-2 text-center">{task.category.name}</td>
                <td className="p-2 text-center">{task.due}</td>
                <td className="p-2 text-center">
                 <p className={`${task.status == 'TODO' ? 'text-blue-600 font-bold' : task.status == 'DOING' ? 'text-orange-800 font-bold' : task.status == 'DONE' ? 'text-green-800 font-bold' : null }`}>{task.status}</p>
                </td>
                <td className="p-2 text-center">
                  <div className="flex gap-x-3">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-lg bg-red-600 p-2 text-white"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash />
                      )}
                    </button>
                    <select
                    value={task.status}
                    onChange={(e) => handleChangeStatus(task.id, e.target.value as 'TODO' | 'DOING' | 'DONE')}
                    className={`rounded-md border w-full px-2 py-1 text-sm ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-800"
                        : task.status === "DOING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <option value="TODO">TODO</option>
                    <option value="DOING">DOING</option>
                    <option value="DONE">DONE</option>
                  </select>
                  </div>
                </td>
              </tr>
            ))}

  
          </tbody>
        </table>
      </div>

      {isModal && (
        <div
          id="modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div className="animate-fade-in mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Category Form
              </h2>
              <button
                onClick={() => setIsModal(false)}
                className="text-gray-400 transition hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="mx-3 flex flex-col">
              <FormField
                type="text"
                onchange={(e) => {
                  setTitle(e.target.value);
                }}
                label="Title"
              />
              <div className="my-3 flex flex-col space-y-2">
                <label>Category</label>

                <select
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`'} w-full rounded-md border border-blue-500 bg-blue-800 p-2 text-white placeholder:text-white/60`}
                >
                  <option value="">Select category of Task</option>
                  {categories.map((cat: any, index: number) => (
                    <option key={index} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <FormField
                type="text"
                onchange={(e) => {
                  setContent(e.target.value);
                }}
                label="Content"
              />
              <FormField
                type="date"
                onchange={(e) => {
                  setDue(e.target.value);
                }}
                label="Due"
              />

              <div className="flex justify-end gap-2">
                <Button
                  onclick={() => setIsModal(false)}
                  color="danger"
                  label="Cancel"
                  type="button"
                />

                <Button
                  color="info"
                  label="Submit"
                  type="submit"
                  isloading={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
