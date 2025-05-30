import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useDeleteBooking = () => {
  const [loading, setLoading] = useState<boolean>();

  const deleteBooking = async (id: string) => {
    setLoading(true);
    try {
      const response = await normalFetch(`/api/book/normal/${id}`, "delete");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const success = await response.json();

      toast.success(success.message);
    } catch (error) {
      console.error(error);
      toast.error("Unknown error while deleting booking");
    } finally {
      setLoading(false);
    }
  };

  return { deleteBooking, loading };
};

export default useDeleteBooking;
