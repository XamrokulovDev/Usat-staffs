import { NavLink } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

const News = () => {
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Rasm:", image);
    console.log("Description:", description);

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("description", description);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("❌ Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
            <label
              htmlFor="imageUpload"
              className="w-full h-full cursor-pointer text-sm text-[#21466D] py-2"
            >
              Rasm yuklash
            </label>
            {image && (
              <span className="ml-2 text-sm text-green-600">{image.name}</span>
            )}
          </div>
        </div>
        <div className="w-full">
          <label className="block text-[#21466D] font-medium mb-2">
            Tavsifni kiriting!
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full bg-[#21466D] text-white px-4 py-2 rounded hover:bg-[#193B5A] transition 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Yuborilmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
};

export default News;