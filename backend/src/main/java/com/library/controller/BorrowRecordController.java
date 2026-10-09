package com.library.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.library.model.BorrowRecord;
import com.library.repository.BorrowRecordRepository;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "http://localhost:3000")
public class BorrowRecordController {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @GetMapping
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }

    @PostMapping
    public BorrowRecord createBorrowRecord(@RequestBody BorrowRecord record) {
        record.setBorrowDate(LocalDate.now());
        record.setStatus(BorrowRecord.Status.BORROWED);
        return borrowRecordRepository.save(record);
    }

    @PutMapping("/{id}/return")
    public BorrowRecord returnBook(@PathVariable int id) {
        BorrowRecord record = borrowRecordRepository.findById(id).orElseThrow();
        record.setStatus(BorrowRecord.Status.RETURNED);
        record.setReturnDate(LocalDate.now());
        return borrowRecordRepository.save(record);
    }
}
