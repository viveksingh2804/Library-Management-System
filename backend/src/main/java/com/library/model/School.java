package com.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="school")
public class School {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    @Column(nullable=false)
    private String name;

    public School(){}

    public School(int id,String name){
        this.id=id;
        this.name=name;
    }

    public int getId(){
        return id;
    }
    public void putId(int id){
        this.id=id;
    }

    public String getName(){
        return name;
    }

    public void putName(String name){
        this.name=name;
    }
}

