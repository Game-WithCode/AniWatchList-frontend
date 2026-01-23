"use client";
import { set } from "mongoose";
import { use, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form"
import { useFormState } from 'react-dom';

export default function UploadBox() {


    const [detailform, setDetailform] = useState({
        title: "",
        category: "Anime",
        description: "",
        RawImageUrl: {},
        imageUrl: "",
        priority: 1,
    });
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm()
    //in process of screenshot uploading user can able to click upload button multiple times
    //so to avoid multiple upload we can disable the button until upload is complete
    const [isUploading, setIsUploading] = useState(false);
    const [isFavoriteSelect, setisFavoriteSelect] = useState(false)

    const handleFileChange = (e) => {

        const file = e.target.files[0];
        if (!file) return;
     
        const url = URL.createObjectURL(file);
  
        setDetailform(prev => ({
            ...prev,
            imageUrl: url,
            RawImageUrl: file
        }));

      
        // setEncrypt(file);
        // setImage(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
      
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        
        const url = URL.createObjectURL(file);
  
        setDetailform(prev => ({
            ...prev,
            imageUrl: url,
            RawImageUrl: file
        }));
    
        // setEncrypt(file);
        // setImage(URL.createObjectURL(file));
    };

    const onSubmit = async (data) => {
        
        setIsUploading(true);


        if (!data.screenshotFile) return;
        const formData = new FormData();
        formData.append("screenshotFile", data.screenshotFile[0]);
        formData.append("screenshotTitle", data.screenshotTitle);
        formData.append("description", data.description);
        formData.append("priority", data.priority);
        formData.append("category", data.category);    
        formData.append("isFavorite", data.isFavorite);    
      
        // formData.append("file", file);
        // formData.append("title", title);
        // formData.append("description", description);
        try {
            const res = await fetch('/api/watchlist/screenshotSave', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();
            if (!res.ok) {
                setIsUploading(false);
                throw new Error(result.message || 'Upload failed');
                toast.error("Failed to upload screenshot.");
            } else {
                setIsUploading(false);
                toast.success("Screenshot uploaded successfully!");
                reset();

                // 2. Clear your custom image preview state
                // (Assuming 'setDetailform' is your state setter)
                setDetailform((prev) => ({ ...prev, imageUrl: null }));

                // 3. Refresh the list if needed
                if (formReloader) formReloader()
            }
           
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    }
    let formReloader = () => {
        setDetailform({
            title: "",
            category: "Anime",
            description: "",
            RawImageUrl: {},
            imageUrl: "",
            priority: 1,
        });
    }

    return (
        <>
         



            <main className="grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-bgsecondary dark:text-white mb-2">Add Screenshot to Your List</h1>
                            <p className="text-slate-100 dark:text-slate-100">Upload a screenshot and add details to keep your watchlist organized.</p>
                        </div>
                        <div className="">
                            <form action="#" className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start" method="POST" onSubmit={handleSubmit(onSubmit)}>
                                <div className="bg-white dark:bg-card-dark rounded-lg p-6 sm:p-8 shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50">

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="screenshot-title">Screenshot Title</label>
                                        <input
                                            className="block w-full rounded-lg 
                                            border border-slate-300 dark:border-slate-600
                                          bg-[#F8F9FC] dark:bg-slate-700/50 shadow-sm 
                                            focus:outline-none 
                                            focus:ring-2 focus:ring-bgsecondary 
                                          focus:border-bgsecondary
                                          text-slate-800 dark:text-slate-200
                                            p-2
                                            sm:text-sm"
                                            id="screenshot-title" name="screenshot-title" placeholder="e.g. Favorite fight scene" type="text"
                                            // value={detailform.title}
                                            // onChange={(e) => setDetailform({ ...detailform, title: e.target.value })}
                                            {...register('screenshotTitle', { required: 'Title is required' })}
                                        />
                                        {errors.screenshotTitle && <p className='text-red-500 text-sm mt-1'>{errors.screenshotTitle.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="category">Category</label>
                                        <select
                                            className="block w-full rounded-lg 
                                            border border-slate-300 dark:border-slate-600
                                          bg-[#F8F9FC] dark:bg-slate-700/50 shadow-sm 
                                            focus:outline-none 
                                            focus:ring-2 focus:ring-bgsecondary 
                                          focus:border-bgsecondary
                                          text-slate-800 dark:text-slate-200
                                            p-2
                                            sm:text-sm"
                                            id="category" name="category"
                                            // value={detailform.category}
                                            // onChange={(e) => setDetailform({ ...detailform, category: e.target.value })}
                                            {...register('category', { required: 'Category is required' })}
                                        >

                                            <option value="Anime">Anime</option>
                                            <option value="Manga">Manga</option>
                                        </select>
                                        {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="description">Notes / Context <span className="text-slate-400 dark:text-slate-500">(Optional)</span></label>
                                        <textarea
                                            className="block w-full rounded-lg 
                                            border border-slate-300 dark:border-slate-600
                                          bg-[#F8F9FC] dark:bg-slate-700/50 shadow-sm 
                                            focus:outline-none 
                                            focus:ring-2 focus:ring-bgsecondary 
                                          focus:border-bgsecondary
                                          text-slate-800 dark:text-slate-200
                                            p-2
                                            sm:text-sm"
                                            id="description" name="description" placeholder="Why you saved this screenshot..." rows="3"
                                            // value={detailform.description ?? ""}
                                            // onChange={(e) => setDetailform({ ...detailform, description: e.target.value })}
                                            {...register('description')}

                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Set Priority</label>

                                        <div className="space-y-3">
                                            {/* Option 1: High Priority (Value: 2) */}
                                            <label className="flex items-center p-4 rounded-lg border border-slate-300 dark:border-slate-600 has-checked:border-bgsecondary has-checked:bg-bgsecondary/5 dark:has-checked:bg-bgsecondary/10 cursor-pointer transition-all duration-200">
                                                <span className="material-symbols-outlined text-red-500 mr-3">priority_high</span>
                                                <span className="grow font-medium text-slate-800 dark:text-slate-200">High Priority</span>

                                                <input
                                                    {...register("priority", { required: "Please select a priority option" })}
                                                    type="radio"
                                                    value="3"
                                                    className="h-4 w-4 border-slate-400 dark:border-slate-500"
                                                />
                                            </label>

                                            {/* Option 2: Low Priority (Value: 1) */}
                                            <label className="flex items-center p-4 rounded-lg border border-slate-300 dark:border-slate-600 has-checked:border-bgsecondary has-checked:bg-bgsecondary/5 dark:has-checked:bg-bgsecondary/10 cursor-pointer transition-all duration-200">

                                                <span className="material-symbols-outlined text-amber-500 ">
                                                    signal_cellular_alt_2_bar
                                                </span>
                                                <span className="grow font-medium text-slate-800 dark:text-slate-200">Medium Priority</span>

                                                <input
                                                    {...register("priority", { required: "Please select a priority option" })}
                                                    type="radio"
                                                    value="2"
                                                    className="h-4 w-4 border-slate-400 dark:border-slate-500 text-primary focus:ring-bgsecondary"
                                                />
                                            </label>

                                            {/* Option 3: Watch After Current (Value: 3) */}
                                            <label className="flex items-center p-4 rounded-lg border border-slate-300 dark:border-slate-600 has-checked:border-bgsecondary has-checked:bg-bgsecondary/5 dark:has-checked:bg-bgsecondary/10 cursor-pointer transition-all duration-200">
                                                <span className="material-symbols-outlined text-blue-500 mr-3">low_priority</span>
                                                <span className="grow font-medium text-slate-800 dark:text-slate-200">Low Priority</span>

                                                <input
                                                    {...register("priority", { required: "Please select a priority option" })}
                                                    type="radio"
                                                    value="1"
                                                    className="h-4 w-4 border-slate-400 dark:border-slate-500 text-primary focus:ring-bgsecondary"
                                                />
                                            </label>

                                            {/* Error Message Display */}
                                            {errors.priority && (
                                                <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                                            )}

                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Set Favorite</label>
                                        <div className='flex items-center justify-between'>
                                            <label className="block text-sm font-medium text-black mb-2">Favorite Only</label>
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" id="isFavorite" name="isFavorite" 
                                                  {...register('isFavorite')} />
                                                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bgsecondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bgsecondary relative"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-card-dark rounded-lg p-6 sm:p-8 shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50">
                                        {/* <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" htmlFor="screenshot-upload">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500 mb-3">cloud_upload</span>
                                                <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">Click or Drop Screenshot</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Supported: JPG, PNG, GIF</p>
                                            </div>
                                            <input className="hidden" id="screenshot-upload" type="file" />
                                        </label> */}
                                        <label
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="
            flex flex-col items-center justify-center
            border-2 border-dashed border-gray-300
            rounded-lg
            h-64  mx-auto  max-w-[900px]
            cursor-pointer
            bg-gray-50 hover:border-[#4f6fe4] transition-border duration-300
        "
                                        >
                                            {detailform.imageUrl ? (

                                                <div className="flex items-center justify-center h-full w-full p-4">
                                                    <img
                                                        src={detailform.imageUrl}
                                                        width={340}
                                                        alt="Uploaded"
                                                        className="object-contain max-h-60 max-w-60 "
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <svg
                                                        className="w-12 h-12 text-gray-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                                        <path d="M12 12V4m0 0l-4 4m4-4l4 4" />
                                                    </svg>

                                                    <p className="text-gray-600 mt-2 font-medium">
                                                        Click or Drop Screenshot
                                                    </p>
                                                    <p className="text-xs text-gray-400">PNG / JPG allowed</p>
                                                </div>
                                            )}

                                            {/* hidden file input */}
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png"
                                                className="hidden "
                                                // onChange={handleFileChange}
                                                id="screenshotFile"
                                                {...register('screenshotFile', { required: 'Screenshot file is required', onChange: handleFileChange })}
                                            />
                                            {errors.screenshotFile && <p className='text-red-500 text-sm mt-1'>{errors.screenshotFile.message}</p>}
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Drag and drop your screenshot here or click to select a file.
                                        </p>
                                    </div>
                                    <button className={isUploading ? "mt-4 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed flex justify-center items-center gap-2" : "w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-bgsecondary hover:bg-bgsecondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bgsecondary focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all duration-300"} type="submit"
                                        disabled={isUploading}>
                                        <span className="material-symbols-outlined fill">add_photo_alternate</span>
                                        Save Screenshot
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
