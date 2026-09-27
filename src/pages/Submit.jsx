import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Image as ImageIcon, Send, ArrowRight, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Submit() {
  const { currentUser } = useAuth();
  const { categories, addFanSubmission } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Anime');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState(currentUser?.name || 'Anonymous Fan');
  const [errors, setErrors] = useState({});
  const [submittedItem, setSubmittedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type (JPG/JPEG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

    if (!allowedTypes.includes(file.type.toLowerCase()) && !allowedExtensions.test(file.name)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
      }));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    // Validate file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: 'File size exceeds the 10MB limit. Please select a smaller file.'
      }));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    // Clear previous image error if valid
    setErrors((prev) => {
      const newErrs = { ...prev };
      delete newErrs.image;
      return newErrs;
    });

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim() || description.length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }
    if (!category) errs.category = 'Select a valid fandom category';
    if (!creator.trim()) errs.creator = 'Creator attribution is required';
    if (!selectedFile) errs.image = 'An image file is required for submission';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const matchedCat = categories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase() || c.id === category || c._id === category
    );
    const catId = matchedCat?.id || matchedCat?._id || category;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('content', content.trim() || description.trim());
      formData.append('category', catId);
      formData.append('creator', creator.trim());
      formData.append('image', selectedFile);

      const res = await addFanSubmission(formData);

      if (res.success && res.submission) {
        setSubmittedItem(res.submission);
        // Clear form and file state
        setTitle('');
        setDescription('');
        setContent('');
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl('');
        setErrors({});
      } else {
        setServerError(res.error || 'Failed to submit content. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setContent('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl('');
    setSubmittedItem(null);
    setErrors({});
    setServerError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight font-display">
          Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">Fan Content</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Share your custom artwork, cosplay photoshoot, orchestral arrangements, or deep lore breakdown with the Fan Hub community.
        </p>
      </div>

      {submittedItem ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c101d] border border-emerald-500/30 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">Submission Successfully Received!</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Your work has entered the moderation queue.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">
                {typeof submittedItem.category === 'object' ? submittedItem.category?.name : submittedItem.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-[10px] font-bold">
                Status: Pending Approval
              </span>
            </div>
            {submittedItem.image && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-black">
                <img
                  src={submittedItem.image}
                  alt={submittedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">{submittedItem.title}</h4>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{submittedItem.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#121829] dark:hover:bg-[#192238] border border-zinc-200 dark:border-white/[0.08] text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              Submit Another Work
            </button>
            <Link
              to="/fan-creations"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c101d] border border-zinc-200 dark:border-white/[0.08] shadow-xl space-y-5">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Title of Creation *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gear 5 Luffy Canvas Painting / Cyberpunk Neon V Cosplay"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {errors.title && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.name} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Creator / Artist Alias *
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              {errors.creator && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.creator}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Brief Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the medium, inspiration, tools used, or lore references..."
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {errors.description && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Artwork Image File *
            </label>

            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-blue-500/50 rounded-2xl cursor-pointer bg-zinc-50 dark:bg-black/50 hover:bg-zinc-100 dark:hover:bg-black/70 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload className="w-8 h-8 mb-2 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Click to upload image</span> or drag and drop
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    JPG, JPEG, PNG, or WEBP (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/60 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Image preview"
                        className="w-16 h-16 object-cover rounded-xl border border-zinc-200 dark:border-white/10 shrink-0"
                      />
                    )}
                    <div className="truncate">
                      <p className="text-xs text-zinc-900 dark:text-white font-bold truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 transition-colors ml-2 shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {errors.image && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5">{errors.image}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading & Submitting...' : 'Submit to Community Review'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

