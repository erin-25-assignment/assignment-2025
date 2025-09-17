
class Node<T> {
  public data: T;
  public next: Node<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class MyLinkedList<T> implements Iterable<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  public size: number = 0;

  constructor(initialData: T[] = []) {
    initialData.forEach(item => this.addLast(item));
  }
  
  addFirst(data: T): void {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.size++;
  }

  addLast(data: T): void {
    const newNode = new Node(data);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  private getNode(index: number): Node<T> | null {
    if (index < 0 || index >= this.size) {
      return null;
    }
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode!.next;
    }
    return currentNode;
  }

  get(index: number): T | null {
    const node = this.getNode(index);
    return node ? node.data : null;
  }

  delete(index: number): T | null {
    if (index < 0 || index >= this.size) {
      return null;
    }

    if (index === 0) {
      return this.deleteFirst();
    }
    
    const prevNode = this.getNode(index - 1);
    const nodeToDelete = prevNode!.next;
    
    if (!nodeToDelete) return null;

    prevNode!.next = nodeToDelete.next;

    if (!prevNode!.next) {
      this.tail = prevNode;
    }

    this.size--;
    return nodeToDelete.data;
  }
  
  deleteFirst(): T | null {
    if (!this.head) {
      return null;
    }
    const deletedData = this.head.data;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.size--;
    return deletedData;
  }

  toArray(): T[] {
    const array: T[] = [];
    let currentNode = this.head;
    while (currentNode) {
      array.push(currentNode.data);
      currentNode = currentNode.next;
    }
    return array;
  }

  *[Symbol.iterator](): Iterator<T> {
    let currentNode = this.head;
    while (currentNode) {
      yield currentNode.data;
      currentNode = currentNode.next;
    }
  }

  clone(): MyLinkedList<T> {
    return new MyLinkedList<T>(this.toArray());
  }
}
