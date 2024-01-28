export default async function fetchTodos() {
    try {
        const res = await fetch('/todos');
    
        const todos = await res.json();
    
        return todos;
    } catch (err) {
        if (err instanceof Error) console.log(err.message);
        return [];
    }
}
