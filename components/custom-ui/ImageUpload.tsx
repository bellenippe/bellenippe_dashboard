import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                onClick={() => onRemove(url)}
                size="sm"
                className="bg-[#696363] rounded-xl text-white hover:bg-red-600"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              height={100}
              width={100}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="yiawruxc" onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              className="text-white bg-[#63817C] text-[0.8rem] rounded-xl hover:bg-[#2d8072] transition-all duration-200 ease-in-out"
              onClick={() => open()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
