"use client";

import React, { useEffect, useState } from "react";
import Authorization from "../../components/Authorization";
import Loading from "../../components/Loading";
import Avatar from "../../components/Avatar";
import { User } from '../../types'


const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/mongodb/users"); // Updated API route
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <Authorization requiredRoles={["admin"]}>
        {() => (
          <div className="px-4 sm:px-6 lg:px-8 mt-[100px] max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-3xl font-semibold text-gray-900">Users</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Registered user information, including roles.
                </p>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Sync Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Roles
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          {/* Name & Avatar */}
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center">
                              <div className="size-11 shrink-0">
                                <Avatar user={user} className="h-11 w-11" />
                              </div>
                              <div className="ml-4">
                                <div className="font-semibold text-gray-900">
                                  {user.given_name || "Unknown"}{" "}
                                  {user.family_name || ""}
                                </div>
                                <div className="mt-1 text-gray-500">
                                  Athlete Id:{" "}
                                  {user._id || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Sync Status */}
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Ok
                            </span>
                          </td>

                          {/* Roles */}
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 flex gap-x-2">
                            {user.roles?.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                              >
                                {role.description}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </Authorization>
    </>
  );
};

export default UsersPage;