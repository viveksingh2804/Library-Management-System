package com.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student")
public class Student {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;


// CREATE TABLE student(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     Name VARCHAR(100) NOT NULL,
//     Place VARCHAR(500),
//     school_id INT,
//     FOREIGN KEY (school_id) REFERENCES school(id)
// );
    @Column(nullable=false,name="Name")
    private String name;
    @Column(name="Place")
    private String place;

    @ManyToOne
    @JoinColumn(name="school_id")
    private School schoolID;

    public Student(){}

    public Student(int id,String name,String place,School schoolID){
        this.id=id;
        this.name=name;
        this.place=place;
        this.schoolID=schoolID;
    }

    public int getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getPlace(){
        return place;
    }
    public School getSchoolId(){
        return schoolID;
    }

    public void putId(int id){
        this.id=id;
    }
     public void putName(String name){
        this.name=name;
    }
     public void putPlace(String place){
        this.place=place;
    }
     public void putSchoolId(School schoolID){
        this.schoolID=schoolID;
    }
}

