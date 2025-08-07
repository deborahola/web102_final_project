import './styles/SearchSort.css';


export default function SearchSort({ searchTerm, sortMode, onChange }) {
  return (
    <div className="search-sort">

      <input
        type="text"
        placeholder="🔍 &nbsp; Search by title..."
        value={searchTerm}
        onChange={e => onChange({ searchTerm: e.target.value, sortMode })}
      />

      <select
        value={sortMode}
        onChange={e => onChange({ searchTerm, sortMode: e.target.value })}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="most">Most upvotes</option>
        <option value="least">Least upvotes</option>
      </select>
      
    </div>
  );
}
