package com.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.library.model.Member;
import com.library.repository.MemberRepository;

@RestController
@RequestMapping("/api/members")
// @CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    // Add new member
    @PostMapping
    public Member addMember(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    // Get all members
    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
}
