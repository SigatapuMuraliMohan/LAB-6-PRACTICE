package com.klef.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.dev.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> 
{
    Employee findByEmail(String email);
    Employee findByContact(String contact);
}