package com.bea.client.dto.ordrebourse;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrdreBourseContextResponse {
    private String cli;
    private String nom;
    private String prenom;
    private List<OrdreBourseAccountResponse> accounts;
    private OrdreBourseResponse latestOrder;
}