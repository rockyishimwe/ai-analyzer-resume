import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
// import type { FSItem } from "~/types/puter"; // Fixed module error
import { useToast } from "~/hooks/useToast";
import { Button } from "~/components/ui/button";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
const [files, setFiles] = useState<any[]>([]);
    const [deleting, setDeleting] = useState(false);
    const { success, error: toastError } = useToast();

const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
};

useEffect(() => {
    loadFiles();
}, []);

useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
        navigate("/auth?next=/wipe");
    }
}, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        if (deleting || files.length === 0) return;
        setDeleting(true);
        try {
            await Promise.all(files.map(file => fs.delete(file.path)));
            await kv.flush();
            success('App data wiped successfully!');
            loadFiles();
        } catch (err) {
            toastError('Wipe failed');
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div>
            Authenticated as: {auth.user?.username}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <Button 
                    onClick={handleDelete}
                    disabled={deleting || files.length === 0}
                    className="w-full max-w-sm"
                >
                    {deleting ? 'Wiping...' : `Wipe ${files.length} Items`}
                </Button>
            </div>
        </div>
    );
};

export default WipeApp;
