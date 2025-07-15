import { NavLink } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface NewsProps {
  id: string;
  content: string;
  image: string;
}

const News = () => {
  const _api = import.meta.env.VITE_API;

  const [description, setDescription] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState<number>(0);
  const maxLength = 1024;

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");

  const [newsList, setNewsList] = useState<NewsProps[]>([]);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${_api}/api/news`);
      setNewsList(response.data.data);
    } catch (error) {
      console.error("Yangiliklarni olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image || descriptionLength === 0) {
      setToastMessage("Formani to'liq to'ldiring!");
      setToastType("error");

      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);

      return;
    }

    if (descriptionLength > maxLength) {
      setToastMessage("Tavsif 1024 belgidan oshib ketdi!");
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
      await axios.post(`${_api}/api/news`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToastMessage("Yangilik saqlandi!");
      setToastType("success");
      setDescription("");
      setDescriptionLength(0);
      setImage(null);
      fetchNews();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
      setToastType("error");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      await axios.delete(`${_api}/api/news/${id}`);
      setToastMessage("Yangilik o'chirildi");
      setToastType("success");
      fetchNews();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
      setToastType("error");
    } finally {
      setDeleteLoadingId(null);

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

      {/* Form */}
      <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 mb-10 p-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">
            Yangilik joylash
          </h1>
          <NavLink to="/" className="underline text-white mb-5">
            Orqaga qaytish
          </NavLink>
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
                setDescriptionLength(data.length);
              }}
            />
            <p
              className={`text-sm mt-2 ${
                descriptionLength > maxLength ? "text-red-600" : "text-gray-500"
              }`}
            >
              {descriptionLength}/{maxLength} belgi kiritildi
            </p>
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
        <div className="w-full mt-15">
          <h2 className="text-lg text-white font-medium mb-8">
            Yangiliklar ro'yxati
          </h2>
          <div className="flex flex-col gap-4">
            {newsList.length === 0 ? (
              <p className="text-white">Yangiliklar mavjud emas</p>
            ) : (
              newsList.map((news) => (
                <div
                  key={news.id}
                  className="bg-white p-4 rounded shadow text-[#21466D]"
                >
                  {news.image && (
                    <img
                      src={`${_api}/uploads/${news.image}`}
                      alt={news.image}
                      className="w-70 h-auto rounded"
                    />
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: news.content }}
                    className="mt-10 mb-2"
                  ></div>
                  <div className="w-full flex items-center justify-end">
                    <button
                      onClick={() => handleDelete(news.id)}
                      disabled={deleteLoadingId === news.id}
                      className="cursor-pointer bg-red-500 text-white px-10 py-1 rounded"
                    >
                      {deleteLoadingId === news.id
                        ? "O'chirilmoqda..."
                        : "O'chirish"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default News;