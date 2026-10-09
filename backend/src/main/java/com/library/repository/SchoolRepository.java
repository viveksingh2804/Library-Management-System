package com.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.model.School;

public interface SchoolRepository extends JpaRepository<School, Integer> {
    
}


    
