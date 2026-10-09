package com.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.library.model.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Integer> {
    @Query("SELECT b FROM BorrowRecord b WHERE b.book.id = :bookId AND b.status = 'BORROWED' ORDER BY b.borrowDate DESC")
    BorrowRecord findFirstByBookIdOrderByBorrowDateDesc(@Param("bookId") int bookId);
}
