import { useEffect, useState } from "react";
import { IBook } from "../utils/bookImporter/bookImporter";
import { getEntry } from "../db/db";

export function useGetBook(id: string | undefined) {
  const [book, setBook] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBook = async () => {
      try {
        setIsLoading(true);
        
        if (id) {
            const entry = getEntry(id);
            if (entry) {
                setBook(entry);
            }
        }
        
        console.log("Pobieranie książki o id:", id);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (!id) return;
    fetchBook();
  }, [id]);

  const refetch = () => {
    fetchBook();
  }

  return { book, isLoading, error, refetch };
}