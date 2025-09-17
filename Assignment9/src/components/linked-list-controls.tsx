
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { Plus, Trash2, Zap, ArrowDown, ArrowUp, Layers, PilcrowSquare, CornerDownLeft, CornerDownRight, Code } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LinkedListControlsProps {
  onUpdate: () => void;
}

const addSchema = z.object({
  data: z.string().min(1, '데이터는 비워둘 수 없습니다'),
  position: z.enum(['head', 'tail']),
});

const indexSchema = z.object({
  index: z.coerce.number().int().min(0, '인덱스는 음수가 아닌 정수여야 합니다'),
});

const dataSchema = z.object({ data: z.string().min(1, '데이터는 비워둘 수 없습니다') });

type AddFormValues = z.infer<typeof addSchema>;
type IndexFormValues = z.infer<typeof indexSchema>;
type DataFormValues = z.infer<typeof dataSchema>;

async function callListApi(operation: string, payload: any) {
  const response = await fetch('/api/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operation, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API 요청 실패');
  }

  return response.json();
}

export default function LinkedListControls({ onUpdate }: LinkedListControlsProps) {
  const { toast } = useToast();
  const [getResult, setGetResult] = useState<string | null>(null);
  
  const addForm = useForm<AddFormValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { data: '', position: 'tail' },
  });
  
  const getForm = useForm<IndexFormValues>({
    resolver: zodResolver(indexSchema),
  });

  const deleteForm = useForm<IndexFormValues>({
    resolver: zodResolver(indexSchema),
  });
  
  const stackForm = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: { data: '' },
  });

  const queueForm = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: { data: '' },
  });

  const handleApiCall = async (operation: string, payload: any, successMessage: string) => {
    try {
      const { result } = await callListApi(operation, payload);
      onUpdate();
      toast({ title: '성공', description: successMessage });
      return result;
    } catch (error: any) {
      toast({ title: '오류', description: error.message, variant: 'destructive' });
    }
  };
  
  const onAdd: SubmitHandler<AddFormValues> = async (values) => {
    const operation = values.position === 'head' ? 'addFirst' : 'addLast';
    await handleApiCall(operation, { data: values.data }, `데이터 "${values.data}"를 가진 노드가 추가되었습니다.`);
    addForm.reset();
  };

  const onGet: SubmitHandler<IndexFormValues> = async (values) => {
    try {
      const { result } = await callListApi('get', { index: values.index });
      if (result !== null) {
        setGetResult(`인덱스 ${values.index}의 데이터: "${result}"`);
        toast({ title: '노드 찾음', description: `인덱스 ${values.index}의 데이터는 "${result}"입니다.` });
      } else {
        setGetResult(`인덱스 ${values.index}에서 노드를 찾을 수 없습니다.`);
        toast({ title: '찾을 수 없음', description: `인덱스 ${values.index}가 범위를 벗어났습니다.`, variant: 'destructive' });
      }
      getForm.reset({ index: undefined });
    } catch (error: any) {
      toast({ title: '오류', description: error.message, variant: 'destructive' });
    }
  };

  const onDelete: SubmitHandler<IndexFormValues> = async (values) => {
    const result = await handleApiCall('delete', { index: values.index }, `인덱스 ${values.index}의 노드가 삭제되었습니다.`);
    if (result === null) {
        toast({ title: '오류', description: `인덱스 ${values.index}가 범위를 벗어났습니다.`, variant: 'destructive' });
    }
    deleteForm.reset({ index: undefined });
  };

  const handleStackPush: SubmitHandler<DataFormValues> = async (values) => {
    await handleApiCall('push', { data: values.data }, `"${values.data}"이(가) 스택의 맨 위에 추가되었습니다.`);
    stackForm.reset();
  };
  
  const handleStackPop = async () => {
    const result = await handleApiCall('pop', {}, '스택에서 데이터를 Pop 했습니다.');
     if (result !== null) {
        toast({ title: '스택에서 Pop', description: `"${result}"이(가) 스택에서 제거되었습니다.` });
      } else {
        toast({ title: '스택이 비어 있습니다', variant: 'destructive' });
      }
  };

  const handleQueueEnqueue: SubmitHandler<DataFormValues> = async (values) => {
    await handleApiCall('enqueue', { data: values.data }, `"${values.data}"이(가) 큐의 끝에 추가되었습니다.`);
    queueForm.reset();
  };

  const handleQueueDequeue = async () => {
    const result = await handleApiCall('dequeue', {}, '큐에서 데이터를 Dequeue 했습니다.');
    if (result !== null) {
        toast({ title: '큐에서 Dequeue', description: `"${result}"이(가) 큐에서 제거되었습니다.` });
      } else {
        toast({ title: '큐가 비어 있습니다', variant: 'destructive' });
      }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>리스트 연산</CardTitle>
        <CardDescription>아래 메서드를 사용하여 연결 리스트를 조작하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">일반</TabsTrigger>
            <TabsTrigger value="stack"><Layers className="mr-2 h-4 w-4"/>스택 (LIFO)</TabsTrigger>
            <TabsTrigger value="queue"><PilcrowSquare className="mr-2 h-4 w-4" />큐 (FIFO)</TabsTrigger>
            <TabsTrigger value="api"><Code className="mr-2 h-4 w-4" />API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 space-y-6">
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4">
                <div className="flex items-end gap-2">
                  <FormField
                    control={addForm.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>노드 추가</FormLabel>
                        <FormControl>
                          <Input placeholder="데이터 입력 (예: 40)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="opacity-0 hidden md:block">위치</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="위치" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tail">꼬리에</SelectItem>
                            <SelectItem value="head">머리에</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full"><Plus className="mr-2 h-4 w-4" /> 추가</Button>
              </form>
            </Form>

            <Separator />

            <Form {...getForm}>
              <form onSubmit={getForm.handleSubmit(onGet)} className="flex items-end gap-2">
                <FormField
                  control={getForm.control}
                  name="index"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>인덱스로 노드 데이터 가져오기</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="인덱스 입력 (예: 1)" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="secondary"><Zap className="mr-2 h-4 w-4"/> 데이터 가져오기</Button>
              </form>
              {getResult && <p className="text-sm mt-2 text-muted-foreground">{getResult}</p>}
            </Form>
            
            <Separator />
            
            <Form {...deleteForm}>
              <form onSubmit={deleteForm.handleSubmit(onDelete)} className="flex items-end gap-2">
                <FormField
                  control={deleteForm.control}
                  name="index"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>인덱스로 노드 삭제하기</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="인덱스 입력 (예: 0)" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> 삭제</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="stack" className="mt-4">
             <div className="space-y-4">
              <Form {...stackForm}>
                <form onSubmit={stackForm.handleSubmit(handleStackPush)} className="flex items-end gap-2">
                   <FormField
                    control={stackForm.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Push (머리에 추가)</FormLabel>
                        <FormControl>
                          <Input placeholder="Push 할 데이터..." {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit"><ArrowDown className="mr-2 h-4 w-4" />Push</Button>
                </form>
              </Form>
              <div>
                <Label>Pop (머리에서 삭제)</Label>
                <Button onClick={handleStackPop} variant="outline" className="w-full justify-start mt-2"><ArrowUp className="mr-2 h-4 w-4" />Pop</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="mt-4">
            <div className="space-y-4">
               <Form {...queueForm}>
                  <form onSubmit={queueForm.handleSubmit(handleQueueEnqueue)} className="flex items-end gap-2">
                    <FormField
                      control={queueForm.control}
                      name="data"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Enqueue (꼬리에 추가)</FormLabel>
                          <FormControl>
                           <Input placeholder="Enqueue 할 데이터..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit"><CornerDownRight className="mr-2 h-4 w-4" />Enqueue</Button>
                  </form>
              </Form>
              <div>
                <Label>Dequeue (머리에서 삭제)</Label>
                <Button onClick={handleQueueDequeue} variant="outline" className="w-full justify-start mt-2"><CornerDownLeft className="mr-2 h-4 w-4" />Dequeue</Button>
              </div>
            </div>
          </TabsContent>
          
           <TabsContent value="api" className="mt-4 space-y-4">
            <div>
              <Label>데이터 가져오기 (GET)</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                현재 연결 리스트의 모든 데이터를 가져옵니다. 아래 <code className="bg-muted px-1 rounded-sm">curl</code> 명령어를 터미널에서 사용하여 데이터를 확인할 수 있습니다.
              </p>
               <div className="text-xs text-muted-foreground font-bold mb-2 space-y-1">
                  <p>• <strong className="text-primary">로컬 VS Code 환경:</strong> <code className="bg-muted px-1 rounded-sm">http://localhost:9002</code>를 사용하세요.</p>
                  <p>• <strong className="text-primary">배포된 환경 (Vercel 등):</strong> 앱의 공개 주소 (예: <code className="bg-muted px-1 rounded-sm">https://myapp.vercel.app</code>)를 사용하세요.</p>
               </div>

              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                <code>
                  # 아래 URL 부분을 자신의 환경에 맞는 주소로 바꿔서 실행하세요
                  curl -X GET [YOUR_APP_URL]/api/list
                </code>
              </pre>
            </div>
            <div>
              <Label>성공 응답 예시</Label>
               <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
                <code className="font-code">
{`{
  "size": 3,
  "data": [
    "10",
    "20",
    "30"
  ]
}`}
                </code>
              </pre>
            </div>
             <div>
              <Label>리스트 조작하기 (POST)</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                <code className="bg-muted px-1 rounded-sm">curl</code>과 같은 도구를 사용하여 <code className="bg-muted px-1 rounded-sm">POST</code> 요청으로 리스트를 조작할 수 있습니다. <code className="bg-muted px-1 rounded-sm">operation</code>과 <code className="bg-muted px-1 rounded-sm">payload</code>를 JSON 바디에 담아 요청하세요. 이 요청은 앱 화면에도 실시간으로 반영됩니다.
              </p>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                <code>
                  {`# 'addLast' 연산으로 '40'을 추가하는 예시
# [YOUR_APP_URL] 부분은 위 GET 요청과 동일한 주소로 바꿔주세요.
curl -X POST -H "Content-Type: application/json" \\
  -d '{"operation": "addLast", "payload": {"data": "40"}}' \\
  [YOUR_APP_URL]/api/list`}
                </code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
