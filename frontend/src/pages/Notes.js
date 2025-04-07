import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFilter, faSort, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import NotesItem from "../components/NotesItem";
import SelectedNote from "../components/SelectedNote";
import AddNote from "../components/AddNote";
import { useNavigate } from "react-router-dom";

const Notes = ({ usernameTransfer }) => {
    const [notes, setNotes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNote, setAddNote] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedDateRange, setSelectedDateRange] = useState("All");
    const [showSortPanel, setShowSortPanel] = useState(false);
    const [sortOption, setSortOption] = useState("");
    const [isHovering, setIsHovering] = useState(false)

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/notes/user/${usernameTransfer}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Failed to fetch notes");
                return;
            }
            const data = await response.json()
            setNotes(data)
            setErrorMessage("")
        } catch(error) {
            setErrorMessage(`Error fetching notes: ${error.message}`)
            console.error(`Error fetching notes: ${error.message}`)
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (note) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/notes/${note._id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Failed to fetch notes");
                return;
            }
            setNotes(prevNotes => prevNotes.filter(n => n._id !== note._id));
            setErrorMessage("")
        } catch(error) {
            setErrorMessage(`Error fetching notes: ${error.message}`)
            console.error(`Error fetching notes: ${error.message}`)
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        localStorage.setItem("visitedNotes", "true");
        
        const handleFilterClickOutside = (event) => {
            if(filterRef.current && !filterRef.current.contains(event.target)){
                setShowFilterPanel(false)
            }
        };

        const handleSortClickOutside = (event) => {
            if(sortRef.current && !sortRef.current.contains(event.target)){
                setShowSortPanel(false)
            }
        };

        document.addEventListener("mousedown", handleFilterClickOutside);
        document.addEventListener("mousedown", handleSortClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleFilterClickOutside);
            document.removeEventListener("mousedown", handleSortClickOutside);
        };
    },[])

    useEffect(() => {
        fetchNotes();
    }, [usernameTransfer])

    const showNotes = notes
        .filter(note => {
            if(note.is_archived) return false;
            
            const matchesTag = selectedTag ? (note.tags || []).includes(selectedTag) : true;

            const noteDate = new Date(note.created_at);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let matchesDate = true;

            switch(selectedDateRange) {
                case "Today":
                    matchesDate = noteDate >= today;
                    break;
                case "Last 7 Days":
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 6);
                    matchesDate = noteDate >= sevenDaysAgo;
                    break;
                case "Last 30 Days":
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(today.getDate() - 29);
                    matchesDate = noteDate >= thirtyDaysAgo;
                    break;
                case "More than 30 Days":
                    const moreThanThirtyDays = new Date();
                    moreThanThirtyDays.setDate(today.getDate() - 30);
                    matchesDate = noteDate < moreThanThirtyDays;
                    break;
                case "All":
                default:
                    matchesDate = true;
                    break;
            }

            const matchesSearch = note.title.toLowerCase().includes(filterText.toLowerCase());

            return matchesTag && matchesDate && matchesSearch;
        })
        .sort((a,b) => {
            switch(sortOption){
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "date-new":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "date-old":
                    return new Date(a.created_at) - new Date(b.created_at);
                default:
                    return 0;
            }
        });

    const archivedNotes = notes.filter(note => note.is_archived);
    const nonArchivedNotes = notes.filter(note => !note.is_archived);
    const allTags = [...new Set(nonArchivedNotes.flatMap(note => note.tags || []))]

    const truncateContent = (content, note) => {
        const words = content.split(" ");
        return words.length > 20 ? (
            <span>
                {words.slice(0,20).join(" ")}...
                <span className="text-blue-600 cursor-pointer" onClick={() => {setSelectedNote(note); setIsEditing(false)}}> Read More</span>
            </span>
        ) : content; 
    }

    const handleLogout = () => {
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="h-screen flex justify-center items-center">
            {/* Search, Profile, Filter, Sort & Add Note icons */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 flex flex-col min-h-[5rem] flex-grow mt-auto md:mt-[10rem]">
            {/* Top Bar with Search & Profile */}
                <div className="flex justify-between items-center w-full p-4">
                    {/* Search bar */}
                    <input 
                        type="text" 
                        placeholder="Search notes by title"
                        className="border rounded-md px-3 py-2 w-3/4 outline-none"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}  
                    />

                    {/* Profile Icon*/}
                    <div className="relative group cursor-pointer" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <FontAwesomeIcon 
                            icon={faUser}
                            className="text-2xl cursor-pointer text-gray-700"
                        />
                        <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            Hi, {usernameTransfer || "Guest"}
                            {usernameTransfer && isHovering && (
                                <button onClick={handleLogout} className="mt-2 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition duration-200">
                                    Logout
                                </button>
                            )}
                        </span>
                    </div>
                </div>
                {/* Filter, Sort, and Add Note Icons */}
                <div className="flex justify-between items-center w-full p-4">
                    <div className="flex gap-4">
                        <FontAwesomeIcon icon={faFilter} className="text-xl text-gray-600 cursor-pointer" onClick={() => setShowFilterPanel(prev => !prev)}/>
                        {showFilterPanel && (
                            <div ref={filterRef} className="absolute mt-2 bg-white border-gray-300 shadow-lg p-4 rounded-lg z-10 w-64">
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Tag</label>
                                    <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="w-full border rounded px-2 py-1">
                                        <option value="">All</option>
                                        {allTags.map((tag, index) => {
                                            return (
                                                <option key={index} value={tag}>{tag}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Created Within: </label>
                                    <select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)} className="w-full border rounded px-2 py-1">
                                        <option value="">Any Time</option>
                                        <option value="Today">Today</option>
                                        <option value="Last 7 Days">Last 7 Days</option>
                                        <option value="Last 30 Days">Last 30 Days</option>
                                        <option value="More than 30 Days">More than 30 Days</option>
                                    </select>
                                </div>
                            </div>
                            
                        )}
                        <div className="relative" ref={sortRef}>
                            <FontAwesomeIcon icon={faSort} className="text-xl text-gray-600 cursor-pointer" onClick={() => setShowSortPanel(prev => !prev)}/>
                            {showSortPanel && (
                                <div className="absolute mt-2 right-0 bg-white border shadow-lg p-2 rounded w-48 z-20">
                                    <button onClick={() => setSortOption("title-asc")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">Title (A-Z)</button>
                                    <button onClick={() => setSortOption("title-desc")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">Title (Z-A)</button>
                                    <button onClick={() => setSortOption("date-new")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">Date (Newest First)</button>
                                    <button onClick={() => setSortOption("date-old")} className="block w-full text-left px-2 py-1 hover:bg-gray-100">Date (Oldest First)</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Note Button */}
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-lg rounded-lg shadow-md hover:bg-blue-700 transition"  onClick={() => setAddNote(true)}>
                        <FontAwesomeIcon icon={faPlus} className="text-2xl"/>
                        Add Note
                    </button>
                </div>

                {/* Data from database - Notes List */}
                <div className="mt-6 w-full flex-grow">
                    {/* Loading State */}
                    {loading ? (
                        <p className="text-center text-gray-500">Loading notes...</p>
                    ) : (
                    <>
                        {showNotes.length > 0 ? (
                        <ul className="space-y-4">
                            {showNotes.map((note) => (
                                <NotesItem key={note._id} note={note} truncateContent={truncateContent} setIsEditing={setIsEditing} setSelectedNote={setSelectedNote} deleteNote={() => deleteNote(note)}/>
                            ))}
                        </ul>
                        ) : errorMessage ? (
                            <p className="text-gray-900 text-3xl mt-4">{errorMessage}</p>
                        ) : (
                            <p className="text-gray-900 text-3xl mt-4">Add Notes to view them here</p>
                        )}
                    </>
                    )}
                </div>

                {/* Archived Notes Section */}
                {archivedNotes.length > 0 && (
                    <div className="mt-6">
                        <button className="w-full bg-gray-300 py-2 text-gray-700 rounded-lg flex justify-center items-center" onClick={() => setShowArchived(!showArchived)}>
                            {showArchived ? "▲ Hide " : "▼ Show "} Archived {showArchived ? "▲" : "▼"}
                        </button>
                        {showArchived && (
                            <ul className="mt-4 space-y-4">
                                {archivedNotes.map((note) => (
                                    <NotesItem 
                                        key={note._id} 
                                        note={note} 
                                        truncateContent={truncateContent} 
                                        setIsEditing={setIsEditing} 
                                        setSelectedNote={setSelectedNote}
                                        deleteNote={() => deleteNote(note)}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Note Pop Up */}
            {selectedNote && (
                <SelectedNote 
                note={selectedNote} 
                isEditing={isEditing} 
                onEdit={() => setIsEditing(true)} 
                onClose={() => setSelectedNote(null)} 
                refreshNotes={fetchNotes}
                onSave={() => setIsEditing(false)}
                deleteNote={() => deleteNote(selectedNote)}
            />
            )}

            {/* Add Note */}
            {addNote && (
                <AddNote 
                    onClose={() => setAddNote(false)}
                    refreshNotes={fetchNotes}
                    username={usernameTransfer}
                />
            )}
        </div>
    )
}

export default Notes;