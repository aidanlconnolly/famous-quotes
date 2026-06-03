import AuthorGallery from "../components/AuthorGallery";

export default function AuthorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Browse by Author</h1>
        <p className="text-[#6b6358] mt-2 max-w-2xl">
          Explore the complete wisdom of each thinker. Click any name to see all their quotes and
          a short biography.
        </p>
      </div>
      <AuthorGallery />
    </div>
  );
}
