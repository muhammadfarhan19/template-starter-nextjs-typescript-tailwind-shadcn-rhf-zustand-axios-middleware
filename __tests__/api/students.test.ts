// __tests__/api/students.test.ts
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
// or for Vitest: import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = process.env.API_URL || "http://localhost:3000";
let authToken: string;
let createdStudentId: string;

// Helper function to make authenticated requests
async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${authToken}`,
      ...options.headers,
    },
  });
}

describe("Students API", () => {
  beforeAll(async () => {
    // TODO: Replace with actual login endpoint
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "john_doe",
        password: "password123",
      }),
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;

    // For now, set token manually
    // authToken = process.env.TEST_TOKEN || "YOUR_TEST_TOKEN";
  });

  describe("GET /api/students", () => {
    it("should return list of students", async () => {
      const response = await authenticatedFetch("/api/students");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data).toHaveProperty("total");
    });

    it("should support pagination", async () => {
      const response = await authenticatedFetch("/api/students?page=1&limit=5");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(5);
      expect(data.data.length).toBeLessThanOrEqual(5);
    });

    it("should filter by status", async () => {
      const response = await authenticatedFetch(
        "/api/students?status=APPROVED"
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      data.data.forEach((student: any) => {
        expect(student.status).toBe("APPROVED");
      });
    });

    it("should filter by grade", async () => {
      const response = await authenticatedFetch("/api/students?grade=1");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      data.data.forEach((student: any) => {
        expect(student.grade).toBe("1");
      });
    });

    it("should search by name", async () => {
      const response = await authenticatedFetch("/api/students?search=Ahmad");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // At least one result should contain "Ahmad" in name or related fields
    });

    it("should return 401 without authentication", async () => {
      const response = await fetch(`${BASE_URL}/api/students`);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unauthorized");
    });
  });

  describe("POST /api/students", () => {
    it("should create student with full data", async () => {
      const studentData = {
        name: `Test Student ${Date.now()}`,
        gender: "MALE",
        address: "Jl. Test No. 123, Test City",
        phoneNumber: `0812${Math.floor(Math.random() * 100000000)}`,
        fatherName: "Test Father",
        motherName: "Test Mother",
        grade: "1",
        status: "PENDING",
      };

      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify(studentData),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toContain("berhasil");
      expect(data.data).toHaveProperty("id");
      expect(data.data.name).toBe(studentData.name);
      expect(data.data.gender).toBe(studentData.gender);
      expect(data.data.status).toBe("PENDING");

      // Save ID for later tests
      createdStudentId = data.data.id;
    });

    it("should create student with minimal data", async () => {
      const studentData = {
        name: `Minimal Student ${Date.now()}`,
        gender: "FEMALE",
        address: "Jl. Minimal No. 456",
      };

      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify(studentData),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("PENDING"); // Default status
    });

    it("should reject empty body", async () => {
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: "",
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("tidak boleh kosong");
    });

    it("should reject missing required fields", async () => {
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({ name: "Test" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("tidak valid");
      expect(data.fields).toBeDefined();
    });

    it("should reject invalid gender", async () => {
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: "Test Student",
          gender: "INVALID",
          address: "Test Address",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.fields?.gender).toBeDefined();
    });

    it("should reject invalid phone format", async () => {
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: "Test Student",
          gender: "MALE",
          address: "Test Address",
          phoneNumber: "invalid-phone",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.fields?.phoneNumber).toBeDefined();
    });

    it("should reject name too short", async () => {
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: "A",
          gender: "MALE",
          address: "Test Address",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.fields?.name).toContain("minimal");
    });

    it("should reject duplicate phone number", async () => {
      // First, create a student
      const phoneNumber = `0812${Math.floor(Math.random() * 100000000)}`;
      await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: "First Student",
          gender: "MALE",
          address: "Test Address",
          phoneNumber,
        }),
      });

      // Try to create another with same phone
      const response = await authenticatedFetch("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: "Second Student",
          gender: "MALE",
          address: "Test Address",
          phoneNumber,
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toContain("sudah terdaftar");
    });
  });

  describe("GET /api/students/:id", () => {
    it("should return student detail", async () => {
      const response = await authenticatedFetch(
        `/api/students/${createdStudentId}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(createdStudentId);
      expect(data.data).toHaveProperty("enrollments");
      expect(data.data).toHaveProperty("_count");
    });

    it("should return 404 for non-existent student", async () => {
      const response = await authenticatedFetch(
        "/api/students/00000000-0000-0000-0000-000000000000"
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("tidak ditemukan");
    });
  });

  describe("PATCH /api/students/:id", () => {
    it("should update student data", async () => {
      const updateData = {
        name: `Updated Student ${Date.now()}`,
        status: "APPROVED",
      };

      const response = await authenticatedFetch(
        `/api/students/${createdStudentId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("berhasil diperbarui");
      expect(data.data.name).toBe(updateData.name);
      expect(data.data.status).toBe("APPROVED");
    });

    it("should update partial data", async () => {
      const response = await authenticatedFetch(
        `/api/students/${createdStudentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ grade: "2" }),
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.grade).toBe("2");
    });

    it("should return 404 for non-existent student", async () => {
      const response = await authenticatedFetch(
        "/api/students/00000000-0000-0000-0000-000000000000",
        {
          method: "PATCH",
          body: JSON.stringify({ name: "Test" }),
        }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/students/stats", () => {
    it("should return statistics", async () => {
      const response = await authenticatedFetch("/api/students/stats");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty("total");
      expect(data.data).toHaveProperty("byStatus");
      expect(data.data).toHaveProperty("byGender");
      expect(data.data).toHaveProperty("byGrade");
      expect(data.data).toHaveProperty("recentRegistrations");
    });
  });

  describe("POST /api/students/bulk", () => {
    it("should bulk update status", async () => {
      const response = await authenticatedFetch("/api/students/bulk", {
        method: "POST",
        body: JSON.stringify({
          studentIds: [createdStudentId],
          action: "update_status",
          status: "APPROVED",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.count).toBeGreaterThan(0);
    });

    it("should reject invalid action", async () => {
      const response = await authenticatedFetch("/api/students/bulk", {
        method: "POST",
        body: JSON.stringify({
          studentIds: [createdStudentId],
          action: "invalid_action",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should reject empty array", async () => {
      const response = await authenticatedFetch("/api/students/bulk", {
        method: "POST",
        body: JSON.stringify({
          studentIds: [],
          action: "update_status",
          status: "APPROVED",
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/students/export", () => {
    it("should export CSV", async () => {
      const response = await authenticatedFetch("/api/students/export");

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/csv");
      expect(response.headers.get("content-disposition")).toContain(
        "attachment"
      );

      const csv = await response.text();
      expect(csv).toContain("Nama"); // CSV header
    });

    it("should export filtered CSV", async () => {
      const response = await authenticatedFetch(
        "/api/students/export?status=APPROVED"
      );

      expect(response.status).toBe(200);
      const csv = await response.text();
      expect(csv).toContain("APPROVED");
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should soft delete student", async () => {
      const response = await authenticatedFetch(
        `/api/students/${createdStudentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("berhasil dihapus");
    });

    it("should return 404 for already deleted student", async () => {
      const response = await authenticatedFetch(
        `/api/students/${createdStudentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });
});
