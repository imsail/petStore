package com.petstore.repository;

import com.petstore.entity.Pet;
import com.petstore.entity.PetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    Page<Pet> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Pet> findByStatus(PetStatus status, Pageable pageable);

    Page<Pet> findByType(String type, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Pet> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<Pet> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    List<Pet> findByStockLessThanAndStatusNot(int stock, PetStatus status);

    long countByStatus(PetStatus status);
}
