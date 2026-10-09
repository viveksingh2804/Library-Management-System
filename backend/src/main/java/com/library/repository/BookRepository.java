package com.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.library.model.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("""
        SELECT b FROM Book b
        LEFT JOIN b.author a
        LEFT JOIN b.publisher p
        LEFT JOIN b.category c
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    List<Book> searchBooks(@Param("keyword") String keyword);
}