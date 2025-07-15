import { NavLink } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const News = () => {
  const _api = import.meta.env.VITE_API;

  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      setToastMessage("Formani to'liq to'ldiring!");
      setToastType("error");

      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);

      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", description);

    try {
      const response = await axios.post(`${_api}/api/news`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setToastMessage("Yangilik saqlandi!");
      setToastType("success");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Xatolik:", error);
      setToastMessage("Xatolik yuz berdi. Console ni tekshir!");
      setToastType("error");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 rounded-md z-50 px-4 py-2 shadow-lg ${
              toastType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toastType === "success" ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-600" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 p-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">
            Yangilik joylash
          </h1>
          <div className="flex items-center gap-5">
            <NavLink to="/" className="underline text-white mb-5">
              Orqaga qaytish
            </NavLink>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full bg-white p-6 rounded-lg mt-10"
          encType="multipart/form-data"
        >
          <div className="w-full">
            <label className="block text-[#21466D] font-medium mb-2">
              Rasm yuklash
            </label>
            <div className="flex items-center gap-2 border border-[#21466D] rounded cursor-pointer pr-3">
              <ImagePlus className="w-5 h-5 text-[#21466D] ml-3 mr-1" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={(e) =>
                  setImage(
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null
                  )
                }
              />
              <label
                htmlFor="imageUpload"
                className="w-full h-full cursor-pointer text-sm text-[#21466D] py-2"
              >
                Rasm yuklash
              </label>
              {image && (
                <span className="ml-2 text-sm text-green-600">
                  {image.name}
                </span>
              )}
            </div>
          </div>
          <div className="w-full">
            <label className="block text-[#21466D] font-medium mb-2">
              Tavsifni kiriting!
            </label>
            <CKEditor
              editor={ClassicEditor as any}
              data={description}
              onChange={(_, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full bg-[#21466D] text-white px-4 py-2 rounded hover:bg-[#193B5A] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </form>
      </div>
    </>
  );
};

export default News;