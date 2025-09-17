
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MyLinkedList } from '@/lib/data-structures/linked-list';

const listDocRef = doc(db, 'linked-list', 'main');

async function getLinkedListFromDB() {
  const docSnap = await getDoc(listDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return new MyLinkedList<string>(data.nodes || []);
  } else {
    const initialNodes: string[] = [];
    await setDoc(listDocRef, { nodes: initialNodes });
    return new MyLinkedList<string>(initialNodes);
  }
}

async function saveLinkedListToDB(list: MyLinkedList<string>) {
  await setDoc(listDocRef, { nodes: list.toArray() });
}

export async function GET() {
  try {
    const list = await getLinkedListFromDB();
    const data = list.toArray();
    return NextResponse.json(
      {
        size: list.size,
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8", //한글 호환
        },
      }
    );
  } catch (error: any) {
    console.error("Error in GET /api/list:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operation, payload } = body;

    const list = await getLinkedListFromDB();
    let result: string | null = null;
    let data: any = null;

    switch (operation) {
      case "addFirst":
        list.addFirst(payload.data);
        data = payload.data;
        break;
      case "addLast":
        list.addLast(payload.data);
        data = payload.data;
        break;
      case "delete":
        result = list.delete(payload.index);
        data = result;
        break;
      case "get":
        result = list.get(payload.index);
        data = result;
        break;
      case "push":
        list.addFirst(payload.data);
        data = payload.data;
        break;
      case "pop":
        result = list.deleteFirst();
        data = result;
        break;
      case "enqueue":
        list.addLast(payload.data);
        data = payload.data;
        break;
      case "dequeue":
        result = list.deleteFirst();
        data = result;
        break;
      default:
        return NextResponse.json(
          { message: "Invalid operation" },
          { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }

    await saveLinkedListToDB(list);

    return NextResponse.json(
      {
        message: `Operation '${operation}' successful.`,
        result: data,
        list: list.toArray(),
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}

