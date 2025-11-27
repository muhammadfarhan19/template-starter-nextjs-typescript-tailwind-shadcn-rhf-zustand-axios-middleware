"use client";

import { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentData } from "@/hooks/useStudentData";
import { Textarea } from "@/components/ui/textarea";
import studentInstance from "@/instances/student.instance";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useRouter } from "next/navigation";
import { useStudentList } from "@/hooks/useStudentList";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phoneNumber: z.string().min(8, "Nomor HP tidak valid"),
  grade: z.string().min(1, "Kelas wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]),
  address: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof formSchema>;

export default function StudentForm() {
  const router = useRouter();

  const { data: studentData, isLoading } = useStudentData();
  const { refetch } = useStudentList();

  const {
    form,
    onSubmit,
    isLoading: isSubmitting,
  } = useFormHandler({
    schema: formSchema,
    mutationFn: async (values) => {
      const res = studentData
        ? await studentInstance.update(values, studentData?.id)
        : await studentInstance.create(values);
      if (!res.success) {
        throw new Error("Gagal menyimpan data");
      }
      return res;
    },

    successMessage: "Data siswa berhasil disimpan",
    errorMessage: (error) =>
      error.message || "Terjadi kesalahan saat menyimpan data",
    onSuccess: () => {
      router.push("/students/list");
      refetch();
    },
    formOptions: {
      defaultValues: {
        name: "",
        phoneNumber: "",
        grade: "",
        gender: "MALE",
        status: "PENDING",
        address: "",
        fatherName: "",
        motherName: "",
      },
    },
  });

  useEffect(() => {
    if (studentData) {
      form.reset({
        name: studentData.name || "",
        phoneNumber: studentData.phoneNumber || "",
        grade: studentData.grade || "",
        gender: (studentData.gender as "MALE" | "FEMALE") || "MALE",
        status:
          (studentData.status as
            | "PENDING"
            | "APPROVED"
            | "REJECTED"
            | "CANCELLED") || "PENDING",
        address: studentData.address || "",
        fatherName: studentData.fatherName || "",
        motherName: studentData.motherName || "",
      });
    }
  }, [studentData, form]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat data...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="col-span-12 space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama santri" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor HP</FormLabel>
              <FormControl>
                <Input placeholder="08123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: A atau 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Disetujui</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ayah</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Ayah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ibu</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Ibu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea placeholder="Masukkan alamat lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
