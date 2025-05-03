"use client";
import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "~/app/_components/button";
import { api } from "~/trpc/react";
import { Loader2, Trash, X } from "lucide-react";
import FormField from "~/app/_components/form-field";

export default function DashboardCategoryPage() {
  const { data } = useSession();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isModal, setIsModal] = useState<boolean>(false);

  const closeModal = async () => {
    setIsModal(false);
    await refetch();
  };

  const { data: categories = [], refetch } = api.category.get.useQuery({
    userId: String(data?.user?.id),
  });
  const categoryMutation = api.category.create.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast.success("Adding category success!");
      closeModal();
    },
    onError: (e) => {
      setLoading(false);
      toast.error(e.message);
    },
  });

  const deleteMutation = api.category.delete.useMutation({
    onSuccess: async () => {
        setLoading(false)
        toast.success('Delete category success!')
        await refetch()
    },

    onError: (e) => {
        setLoading(false)
        toast.error(e.message)
    }
  })

  const handleDeleteCategory = async (id: string) => {
    setLoading(true)
    deleteMutation.mutate({id: id , userId: String(data?.user?.id)})
    await refetch()
  }

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    categoryMutation.mutate({ name: name, userId: String(data?.user?.id) });
  };
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard / Category</h1>
      <div className="mt-4 flex space-x-2">
        <Button
          label="Add Category"
          type="button"
          onclick={() => setIsModal(true)}
          isloading={false}
          color="info"
        />
      </div>

      <div className="mt-8">
        <table className="w-full table-auto border-b-0 border-t-0 border-t-gray-600 border-r border-l-gray-500 border-l border-r-gray-500 ">
           <thead className="bg-blue-800 text-white ">
           <tr>
                <th className=" border-b-2 py-2 border-b-black">#</th>
                <th className="border-b-2 py-2 border-b-black">Name</th>
                <th className="border-b-2 py-2 border-b-black">Slug</th>
                <th className="border-b-2 py-2 border-b-black">Actions</th>
            </tr>
           </thead>
           <tbody  className="bg-white shadow-sm">
            {categories.map((cat:any , idx: number) => (
                <tr key={idx}>
                    <td className="text-center p-2">{idx + 1}</td>
                    <td className="text-center p-2">{cat.name}</td>
                    <td className="text-center p-2">{cat.slug}</td>
                    <td className="text-center p-2">
                        <div className="flex gap-x-3">
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 bg-red-600 text-white rounded-lg">
                                {loading ? <Loader2 className="animate-spin"/> : <Trash/>}
                            </button>
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
            <form
              onSubmit={handleCreateCategory}
              className="mx-3 flex flex-col"
            >
              <FormField
                type="text"
                onchange={(e) => {
                  setName(e.target.value);
                }}
                label="Name"
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
