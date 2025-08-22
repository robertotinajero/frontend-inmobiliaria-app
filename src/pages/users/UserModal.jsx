// src/components/users/UserModal.jsx
import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";

export default function UserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    id_role: "",
    id_department: "",
    profile_image_url: "",
  });
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (user) setForm({ ...form, ...user, password: "" });

    // cargar roles y departamentos
    apiFetch("/api/roles").then(setRoles).catch(console.error);
    apiFetch("/api/departments").then(setDepartments).catch(console.error);
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await apiFetch(`/api/users/${user.id_user}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/api/users", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      onSaved();
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-bold mb-4">
          {user ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              name="firstname"
              placeholder="Nombre"
              value={form.firstname}
              onChange={handleChange}
              className="border rounded p-2 flex-1"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              value={form.lastname}
              onChange={handleChange}
              className="border rounded p-2 flex-1"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />

          {!user && (
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          )}

          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />

          <select
            name="id_role"
            value={form.id_role}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Seleccione Rol</option>
            {roles.map((r) => (
              <option key={r.id_role} value={r.id_role}>
                {r.nm_role}
              </option>
            ))}
          </select>

          <select
            name="id_department"
            value={form.id_department}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Seleccione Departamento</option>
            {departments.map((d) => (
              <option key={d.id_department} value={d.id_department}>
                {d.nm_department}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
