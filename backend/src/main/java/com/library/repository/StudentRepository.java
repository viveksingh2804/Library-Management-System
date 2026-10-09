package com.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.model.Student;

public interface StudentRepository extends JpaRepository<Student,Integer>{
    
}
